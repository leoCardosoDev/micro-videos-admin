import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { CategoryModelMapper } from '../category-model-mapper';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { Category } from '../../../../domain/category.entity';
import { UUID } from 'sequelize';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';

describe('CategoryModelMapper Integration Test', () => {
  let sequelize: Sequelize
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        models: [CategoryModel],
      })
      await sequelize.sync({ force: true })
    })

  it('should throws error when category is invalid', async () => {
    const model = CategoryModel.build({
      category_id: '9366b0a2-4f3c-4d7e-8b1c-5f6e9a0d8f3b',
    })
    try {
      CategoryModelMapper.toEntity(model)
      fail('The category is valid, but it needs throws a EntityValidationError')
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError)
      expect((e as EntityValidationError).error).toMatchObject(
        {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ],
        }
      )
    }
  })

  it('should convert a CategoryModel to a Category entity', () => {
    const created_at = new Date()
    const model = CategoryModel.build({
      category_id: '9366b0a2-4f3c-4d7e-8b1c-5f6e9a0d8f3b',
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at,
    })
    const entity = CategoryModelMapper.toEntity(model)
    expect(entity.toJson()).toStrictEqual(
      new Category({
        category_id: new Uuid('9366b0a2-4f3c-4d7e-8b1c-5f6e9a0d8f3b'),
        name: 'Movie',
        description: 'Movie description',
        is_active: true,
        created_at
      }).toJson()
    )
  })

  it('should convert a Category entity to a CategoryModel', () => {
    const created_at = new Date()
    const entity = new Category({
      category_id: new Uuid('9366b0a2-4f3c-4d7e-8b1c-5f6e9a0d8f3b'),
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at
    })
    const model = CategoryModelMapper.toModel(entity)
    expect(model.toJSON()).toStrictEqual({
      category_id: '9366b0a2-4f3c-4d7e-8b1c-5f6e9a0d8f3b',
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at,
    })
  })
})
