# VuePagination is a vue component that provides core pagination functionality

# Installation

```
	npm install --save-dev tth-v-pagination
```

Then you can use it in your component...

```
	<template>
		<div>
			...

			<v-pagination :total="total" @paginate="onPaginate"/>
		</div>
	</template>
	<script>
		import VuePagination from 'tth-v-pagination';

		export default {
			...
			components: {
				'v-pagination': VuePagination,
			},
			...
			methods: {
				...
				onPaginate: function(query){

				}
			}
		}
	</script>
```
