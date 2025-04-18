import { NotFoundError } from '../../../../../shared/domain/erros/not.found.error'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'
import { Category } from '../../../../domain/category.entity'
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository'
import { CategoryModel } from '../../../../infra/db/sequelize/category.model'
import { UpdateCategoryUseCase } from '../../update-category-usecase'

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase
  let repository: CategorySequelizeRepository
  setupSequelize({models: [CategoryModel]})

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new UpdateCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid()
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category))
  })

  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    let output = await useCase.execute({
      id: entity.category_id.id,
      name: 'test',
      description: 'some description',
      is_active: true,
    })
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description:'some description',
      is_active: true,
      created_at: entity.created_at,
    })
  })
})
