const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	await knex('blog').del()
	
	// Array untuk menampung data dummy
	const blogs = [];

	// Loop untuk membuat 50 data dummy
	for (let i = 0; i < 50; i++) {
		blogs.push({
			slug: faker.lorem.slug(),
			banner: faker.image.url(),
			title: faker.lorem.sentence(),
			description: faker.lorem.paragraph(),
			content: faker.lorem.paragraphs(),
			uploader: 'ramasakti',
			status: 'None',
			hit: Math.floor(Math.random() * 101)
		});
	}

	// Insert data dummy ke dalam tabel blogs
	await knex('blog').insert(blogs);
};
