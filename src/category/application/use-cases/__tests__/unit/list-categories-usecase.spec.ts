import { Category } from '../../../../domain/category.entity'
import { CategorySearchResult } from "../../../../domain/category.repository"
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository"
import { CategoryOutputMapper } from '../../common/category-output'
import { ListCategoriesUseCase } from "../../list-categories-usecase"

describe("ListCategoriesUseCase Unit Tests", () => {
  let useCase: ListCategoriesUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new ListCategoriesUseCase(repository)
  })

  it('toOutput method', () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    })
    let output = useCase["toOutput"](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    })

    const entity = Category.create({ name: 'Movie' })
    result = new CategorySearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2
    })
    output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [entity].map(CategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    })
  })

  it('should return output sorted by created_at when input param is empty', async () => {
    const items = [
      new Category({ name: 'test 1' }),
      new Category({ name: 'test 2', created_at: new Date(new Date().getTime() + 100) })
    ]
    repository.items = items
    const output = await useCase.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1
    })
  })
})
