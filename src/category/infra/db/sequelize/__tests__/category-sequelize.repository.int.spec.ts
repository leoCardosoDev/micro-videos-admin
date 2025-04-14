import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../shared/domain/erros/not.found.error'
import { CategoryModelMapper } from '../category-model-mapper'
import { CategorySearchParams, CategorySearchResult } from '../../../../domain/category.repository'

describe('CategorySequelizeRepository Integration Test', () => {
  let sequelize: Sequelize
  let repository: CategorySequelizeRepository

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [CategoryModel],
    })
    await sequelize.sync({ force: true })
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  describe('insert method tests', () => {
    it('should insert a category', async () => {
      const category = Category.fake().aCategory().build()
      await repository.insert(category)
      let entity = await repository.findById(category.category_id)
      expect(entity.toJson()).toStrictEqual(category.toJson())
    })

    it('should finds a entity by id', async () => {
      let entityFound = await repository.findById(new Uuid())
      expect(entityFound).toBeNull()
      const entity = Category.fake().aCategory().build()
      await repository.insert(entity)
      entityFound = await repository.findById(entity.category_id)
      expect(entityFound.toJson()).toStrictEqual(entity.toJson())
    })

    it('should return all categories', async () => {
      const entity = Category.fake().aCategory().build()
      await repository.insert(entity)
      const entities = await repository.findAll()
      expect(entities).toHaveLength(1)
      expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
    })

    it('should throw error on update when a entity not found', async () => {
      const entity = Category.fake().aCategory().build()
      await expect(repository.update(entity)).rejects.toThrow(
        new NotFoundError(entity.category_id.id, Category)
      )
    })

    it('should update a entity', async () => {
      const entity = Category.fake().aCategory().build()
      await repository.insert(entity)
      entity.changeName('updated name')
      await repository.update(entity)
      const entityFound = await repository.findById(entity.category_id)
      expect(entityFound.toJson()).toStrictEqual(entity.toJson())
    })

    it('should throw error on delete when a entity not found', async () => {
      const categoryId = new Uuid()
      await expect(repository.delete(categoryId)).rejects.toThrow(
        new NotFoundError(categoryId.id, Category)
      )
    })

    it('should delete a entity', async () => {
      const entity = Category.fake().aCategory().build()
      await repository.insert(entity)
      await repository.delete(entity.category_id)
      await expect(repository.findById(entity.category_id)).resolves.toBeNull()
    })
  })

  describe('search method tests', () => {
    it('should only apply paginate when other pararms are null', async () => {
      const created_at = new Date()
      const categories = Category.fake().theCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(created_at).build()
      await repository.bulkInsert(categories)
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')
      const searchOutput = await repository.search(new CategorySearchParams())
      expect(searchOutput).toBeInstanceOf(CategorySearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(16)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      })
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category)
        expect(item.category_id).toBeInstanceOf(Uuid)
      })
      const items = searchOutput.items.map((item) => item.toJson())
      expect(items).toMatchObject(categories.map((item) => item.toJson()))
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const categories = Category.fake().theCategories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index)).build()
      const searchOutput = await repository.search(new CategorySearchParams())
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`)
      })
    })

    it('should apply paginate and filter', async () => {
      const categories = [
        Category.fake().aCategory().withName('test').withCreatedAt(new Date(new Date().getTime() + 5000)).build(),
        Category.fake().aCategory().withName('a').withCreatedAt(new Date(new Date().getTime() + 4000)).build(),
        Category.fake().aCategory().withName('TEST').withCreatedAt(new Date(new Date().getTime() + 3000)).build(),
        Category.fake().aCategory().withName('TeSt').withCreatedAt(new Date(new Date().getTime() + 2000)).build(),
      ]
      await repository.bulkInsert(categories)
      let searchOutput = await repository.search(new CategorySearchParams({
        page: 1,
        per_page: 2,
        filter: 'TEST',
      }))
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true)
      )
      searchOutput = await repository.search(new CategorySearchParams({
        page: 2,
        per_page: 2,
        filter: 'TEST',
      }))
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true)
      )
    })

    
  })
})
