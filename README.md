# Vue Table

Vue Table provides implementation of Bootstrap table with server side filtering and pagination.

# Installation

```
	npm install --save-dev tth-vue-table
```

Then you can use it in your component...

```
	<template>
		<div>
			...

			<v-table title="Inquiries List"
				v-if="index"
				:index="index"
				:enable-edit="true"
				:enable-delete="true"
				:enable-view="true"
				@edit="onEdit"
				@delete="onDelete"
				@delete="onView"
				:labels="labels">
			</v-table>
		</div>
	</template>
	<script>
		import VueTable from 'tth-vue-table';

		export default {
			...
			components: {
				'v-table': VueTable,
			},
			data: function(){
				index: YourServices.index,
				labels: [
					{ field: "id", title: "ID", 'filters': [], 'sortable': true },
				],
			},
			methods: {
				...
			}
		}
	</script>
```