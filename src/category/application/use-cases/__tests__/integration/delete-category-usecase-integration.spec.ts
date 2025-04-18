import { NotFoundError } from '../../../../../shared/domain/erros/not.found.error'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'
import { Category } from '../../../../domain/category.entity'
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository'
import { CategoryModel } from '../../../../infra/db/sequelize/category.model'
import { DeleteCategoryUseCase } from '../../delete-category-usecase'


describe('DeleteCategoryUseCase Integration Tests', () => {
  let usecase: DeleteCategoryUseCase
  let repository: CategorySequelizeRepository
  setupSequelize({models: [CategoryModel]})

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
    usecase = new DeleteCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid()
    await expect(() =>
      usecase.execute({ id: uuid.id }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category))
  })

  it('should delete a category', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    await usecase.execute({ id: entity.category_id.id })
    await expect(repository.findById(entity.category_id)).resolves.toBeNull()
  })
})
