import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/erros/not.found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from '../../../domain/category.repository';
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './category-model-mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) { }

  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity)
    await this.categoryModel.create(modelProps.toJSON())
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const modelsProps = entities.map(entity =>
      CategoryModelMapper.toModel(entity).toJSON())
    await this.categoryModel.bulkCreate(modelsProps)
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id
    const modelProps = await this._get(id)
    if(!modelProps) {
      throw new NotFoundError(id, this.getEntity())
    }
    const modelToUpdate = CategoryModelMapper.toModel(entity)
    await this.categoryModel.update(modelToUpdate.toJSON(), {where: {category_id: id}})
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id
    const modelProps = await this._get(id)
    if(!modelProps) {
      throw new NotFoundError(id, this.getEntity())
    }
    await this.categoryModel.destroy({where: {category_id: id}})
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const modelProps = await this._get(entity_id.id);
    return modelProps ? CategoryModelMapper.toEntity(modelProps) : null
  }

  async findAll(): Promise<Category[]> {
    const modelsProps = await this.categoryModel.findAll();
    return modelsProps.map(model => {
      return CategoryModelMapper.toEntity(model)
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page
    const { rows: modelProps, count } = await this.categoryModel.findAndCountAll({
      ...props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "desc"]] }), offset, limit
      }
    })
    return new CategorySearchResult({
      items: modelProps.map(model => {
        return CategoryModelMapper.toEntity(model)
      }),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    })
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }
}
