import { InvalidUuidError, Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUsecase } from "../../get-category-usecase";
import { NotFoundError } from '../../../../shared/domain/erros/not.found.error';
import { Category } from '../../../domain/category.entity';

describe('GetCategoryUseCase', () => {
  let useCase: GetCategoryUsecase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new GetCategoryUsecase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id' }))
      .rejects.toThrow(new InvalidUuidError())
    const uuid = new Uuid()
    await expect(() =>
      useCase.execute({ id: uuid.id }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category))
  })

  it('should returns a category', async () => {
    const items = [Category.create({ name: 'Movie' })]
    repository.items = items
    const spyFindById = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: items[0].category_id.id })
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: items[0].category_id.id,
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: items[0].created_at
    })
  })
})
