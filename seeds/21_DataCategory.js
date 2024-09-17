/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('data_category').del()

	const categories = [];

	for (let blog_id = 1; blog_id <= 50; blog_id++) {
		const numberOfCategories = Math.floor(Math.random() * 5) + 1;
		const selectedCategories = new Set();
		while (selectedCategories.size < numberOfCategories) {
			selectedCategories.add(Math.floor(Math.random() * 5) + 1);
		}
		for (const category_id of selectedCategories) {
			categories.push({
				blog_id: blog_id,
				category_id: category_id
			});
		}
	}

	await knex('data_category').insert(categories);
};
