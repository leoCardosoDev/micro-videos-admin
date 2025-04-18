import { setupSequelize } from "../../../../../shared/infra/testing/helpers"
import { Category } from "../../../../domain/category.entity"
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository"
import { CategoryModel } from "../../../../infra/db/sequelize/category.model"
import { CategoryOutputMapper } from "../../common/category-output"
import { ListCategoriesUseCase } from "../../list-categories-usecase"

describe('ListCategoriesUseCase Integration Tests', () => {
  let useCase: ListCategoriesUseCase
  let repository: CategorySequelizeRepository
  setupSequelize({models: [CategoryModel]})

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new ListCategoriesUseCase(repository)
  })

  it.skip('should return output sorted by created_at when input param is empty', async () => {
    const categories = Category.fake().theCategories(2)
    .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i)).build()
    await repository.bulkInsert(categories)
    const output = await useCase.execute({})
    expect(output).toEqual({
      items: [...categories].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    })
  })
})
