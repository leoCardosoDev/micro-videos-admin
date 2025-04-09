import { Category } from '../../domain/category.entity';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  })

  it('should be defined', () => {
    expect(repository).toBeDefined();
  })
  it('should apply filter correctly', async () => {
    const items = [Category.fake().aCategory().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any)
    const itemsFilterd = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled()
    expect(itemsFilterd).toStrictEqual(items)
  })

  it('should filter item using filter parameter', async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build()
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any)
    const itemsFilterd = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFilterd).toStrictEqual([items[0], items[1]])
  })

  it('should sort by created_at when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      Category.fake().aCategory().withName('test').withCreatedAt(createdAt).build(),
      Category.fake().aCategory().withName('TEST').withCreatedAt(new Date(createdAt.getTime() + 1000)).build(),
      Category.fake().aCategory().withName('fake').withCreatedAt(new Date(createdAt.getTime() + 2000)).build()
    ];
    const itemsSorted = await repository['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('should sort by name', async () => {
    const items = [
      Category.fake().aCategory().withName('c').build(),
      Category.fake().aCategory().withName('b').build(),
      Category.fake().aCategory().withName('a').build()
    ]
    let itemsSorted = await repository['applySort'](items, 'name', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
    itemsSorted = await repository['applySort'](items, 'name', 'desc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })
})
