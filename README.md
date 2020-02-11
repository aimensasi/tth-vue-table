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

			<v-table />
		</div>
	</template>
	<script>
		import VueTable from 'tth-vue-table';

		export default {
			...
			components: {
				'v-table': VueTable,
			},
			...
			methods: {
				...
			}
		}
	</script>
```