import { IUseCase } from '../../../shared/application/use-case.interface';
import { Category } from '../../domain/category.entity';
import { ICategoryRepository } from '../../domain/category.repository';
import { CategoryOutput, CategoryOutputMapper } from './common/category-output';

export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOuput> {

  constructor(private readonly categoryRepo: ICategoryRepository) { }

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOuput> {
    const entity = Category.create(input)
    await this.categoryRepo.insert(entity)
    return CategoryOutputMapper.toOutput(entity)
  }
}

export type CreateCategoryInput = {
  name: string
  description?: string | null
  is_active?: boolean
}

export type CreateCategoryOuput = CategoryOutput
