import { Category } from "../../../domain/category.entity"
import { CategoryOutputMapper } from "./category-output"

describe('CategoryOutputMapper Unit Tests', () => {
  it('should convert a category in output', () => {
    const created_at = new Date()
    const entity = Category.fake().aCategory().withCreatedAt(created_at).build()
    const spyToJson = jest.spyOn(entity, 'toJson')
    const output = CategoryOutputMapper.toOutput(entity)
    expect(spyToJson).toHaveBeenCalled()
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: created_at,
    })
  })
})
