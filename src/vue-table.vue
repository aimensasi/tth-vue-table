<template>
	<div class="card mt-5 custom-table">
		<div class="card-header d-flex align-items-center">
			<h4 class="card-title">{{ title }}</h4>
		</div>
		<div class="card-body">
			<div class="table-header d-flex">
				<slot name="table-header-actions"></slot>
			</div>
			<div class="table-header d-flex">
				<input type="text" class="form-control" placeholder="Search..." @input="onSearch">
				<v-select :options="sortOptions" :clearable="true" placeholder="Sort by..." @input="onSort"></v-select>
				<a href="#" class="btn-link ml-2 my-auto" @click="onOrder($event, 'desc')">
					<i class="far fa-sort-amount-down fa-lg"></i>
				</a>
				<a href="#" class="btn-link ml-1 mr-1 my-auto" @click="onOrder($event, 'asc')">
					<i class="far fa-sort-amount-down fa-lg" style="transform: rotate(180deg);"></i>
				</a>
				<a href="#" class="btn-link ml-2 my-auto" @click="onRefresh">
					<i class="far fa-sync fa-lg"></i>
				</a>
			</div>
			<div class="table-responsive-sm">
				<table class="table">
					<thead>
						<tr>
							<th scope="col" v-for="label in labels" :key="label.field">{{ label.title }}</th>
							<th scope="col" v-if="enableView || enableEdit || enableDelete">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in items" :key="item.id">
							<td v-for="label in labels" :key="item.id + label.field">{{ value(item, label) }}</td>
							<td v-if="enableView || enableEdit || enableDelete">
								<a rel="tooltip" title="View" class="btn-link btn-info"
									@click="onView($event, item.id)" v-if="enableView">
									<i class="fal fa-eye"></i>
								</a>
								<a rel="tooltip" title="Edit" class="btn-link btn-warning"
									@click="onEdit($event, item.id)" v-if="enableEdit">
									<i class="fal fa-edit"></i>
								</a>
								<a rel="tooltip" title="Remove" class="btn-link btn-danger"
									@click="onDelete($event, item.id)" v-if="enableDelete">
									<i class="fal fa-trash"></i>
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<v-pagination :total="total" @paginate="onPaginate"/>
		</div>
	</div>
</template>

<script>
	import VuePagination from 'tth-v-pagination';

	export default {
		props: {
			title: {
				required: false,
				type: String,
				default: 'Items List'
			},
			index: {
				required: true,
				type: Function,
			},
			enableView: {
				required: false,
				type: Boolean,
				default: false,
			},
			enableEdit: {
				required: false,
				type: Boolean,
				default: false,
			},
			enableDelete: {
				required: false,
				type: Boolean,
				default: false,
			},
			labels: {
				required: true,
				type: Array,
			},
		},
		components: {
      'v-pagination': VuePagination,
    },
		data: function(){
			return {
				items: [],
				sortOptions: [],
				filter: {},
				total: 0,
			}
		},
		mounted(){
			this.setDefaults();
		},
		methods: {
			setDefaults: function(){
				_.each(this.labels, (label) => {
					if(label.sortable){
						this.sortOptions.push({ label: label.title, code: label.field });
					}
				});

				this.fetch();
			},
			fetch: function(){
				this.index(this, { query: this.filter, onSuccess: ({ data }) => {
					this.items = data.rows;
					this.total = data.total;
				}});
			},
			value: function(item, label){
				let value = item[label.field];

				if(!_.isEmpty(label.default) && _.isEmpty(value)){
					value = label.default;
				}

				if(!_.isEmpty(label.filters)){
					value = this.applyFilters(value, label.filters);
				}

				return value;
			},
			applyFilters: function(value, filters){
				_.each(filters, (filter) => {
					switch(filter){
						case 'truncate':
							value = Utility.truncate(value, 50);
						break;
					}
				});

				return value;
			},
			onPaginate: function(query){
				_.merge(this.filter, query);
				this.fetch();
			},
			onSearch: function(e){
				let query = $(e.target).val();
				_.merge(this.filter, {search: query});
				this.fetch();
			},
			onSort: function(query){
				if(_.isEmpty(query)){
					this.$delete(this.filter, 'sort');
				}else{
					_.merge(this.filter, {sort: query.code});
				}

				this.fetch();
			},
			onOrder: function(e, order){
				e.preventDefault();
				_.merge(this.filter, {order: order});
				this.fetch();
			},
			onRefresh: function(e){
				e.preventDefault();
				this.fetch();
			},
			onView: function(e, id){
				e.preventDefault();
				this.$emit("view", id);
			},
			onEdit: function(e, id){
				e.preventDefault();
				this.$emit("edit", id);
			},
			onDelete: function(e, id){
				e.preventDefault();
				Modal.dialog(this, {
					title: 'Are you sure!',
					text: "This action cannot be recovered.",
					onConfirm: () => {
						let items = _.filter(this.items, (item) => { return item.id != id; });
						this.items = items;
						Modal.hide(this);
						this.$emit("delete", id);
					},
					onCancel: () => {
						Modal.hide(this);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-table {
		.pull-left {
			width: 100%;
			@media (min-width: 576px) {
				width: auto;
			}
		}
		.form-control {
			border: 1px solid #ddd !important;
			width: 100%;
			&::-webkit-input-placeholder { /* WebKit, Blink, Edge */
				color: #ddd;
			}
			&:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
				color: #ddd;
				opacity: 1;
			}
			&::-moz-placeholder { /* Mozilla Firefox 19+ */
				color: #ddd;
				opacity: 1;
			}
			&:-ms-input-placeholder { /* Internet Explorer 10-11 */
				color: #ddd;
			}
			&::-ms-input-placeholder { /* Microsoft Edge */
				color: #ddd;
			}

			&::placeholder { /* Most modern browsers support this now. */
				color: #ddd;
			}
			@media (min-width: 576px) {
				width: 400px;
			}
			&:hover {
				border: 1px solid #ddd !important;
			}
		}
		.table-header{
			padding-bottom: 1rem;
		}
		.bootstrap-table, .card-body {
			table {
				td, th {
					vertical-align: middle;
					text-align: center;
				}
				thead {
					th {
						font-weight: bold;
						text-transform: uppercase;
						&.td-actions {
							display: table-cell !important;
							width: 1%;
  						white-space: nowrap;
						}
						.sortable {
							padding-right: 25px;
						}
					}
				}
				tbody {
					tr {
						td {
							&:last-child {
								display: table-cell !important;
								padding-right: 8px !important;
								a {
									&:focus {
										outline: 0;
									}
									&:last-child {
										margin-left: 10px;
									}
									i {
										font-size: 20px;
										width: auto;
									}
								}
							}
							a[rel=tooltip] {
								cursor: pointer;
								background-color: transparent !important;
								transition: color 5s ease;
								&.btn-info{
									margin-right: 10px;
									&:hover {
										i {
											color: #044ff7 !important;
										}
									}
								}
								&.btn-warning:hover {
									i {
										color: #FFA534 !important;
									}
								}
								&.btn-danger:hover {
									i {
										color: #FB404B !important;
									}
								}
							}
						}
					}
				}
			}
		}
		.card-body {
			table {
				thead {
					th {
						&:last-child {
							width: 1%;
  						white-space: nowrap;
						}
					}
				}
				tbody {
					tr {
						td {
							&:last-child {
								width: 1%;
  						white-space: nowrap;
							}
							&:nth-child(4) {
								@media (max-width: 575px) {
									text-align: center;
								}
							}
							&.td-actions {
								a {
									&:hover {
										color: #ddd;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
