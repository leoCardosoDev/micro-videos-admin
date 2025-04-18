import { NotFoundError } from "../../../../../shared/domain/erros/not.found.error"
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../../../../domain/category.entity"
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository"
import { UpdateCategoryUseCase } from "../../update-category-usecase"

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new UpdateCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }))
      .rejects.toThrow(new InvalidUuidError())
    const uuid = new Uuid()
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category))
  })

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const entity = Category.fake().aCategory().withName('Movie').build()
    repository.items = [entity]
    let output = await useCase.execute({
      id: entity.category_id.id,
      name: 'test',
      description: null
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    })
  })
})
