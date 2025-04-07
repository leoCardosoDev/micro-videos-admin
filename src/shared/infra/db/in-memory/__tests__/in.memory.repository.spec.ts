import { Entity } from '../../../../domain/entity'
import { NotFoundError } from '../../../../domain/erros/not.found.error'
import { Uuid } from '../../../../domain/value-objects/uuid.vo'
import { InMemoryRepository } from '../in.memory.repository'

type StubEntityConstructor = {
  entity_id?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entity_id: Uuid
  name: string
  price: number
  constructor(props: StubEntityConstructor) {
    super()
    this.entity_id = props.entity_id || new Uuid()
    this.name = props.name
    this.price = props.price
  }
  toJson() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    }
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repo: StubInMemoryRepository

  beforeEach(() => {
    repo = new StubInMemoryRepository()
  })

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'test',
      price: 100,
    })
    await repo.insert(entity)
    expect(repo.items.length).toBe(1)
    expect(repo.items[0]).toBe(entity)
  })

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'test1',
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'test2',
        price: 200,
      }),
    ]
    await repo.bulkInsert(entities)
    expect(repo.items.length).toBe(2)
    expect(repo.items[0]).toBe(entities[0])
    expect(repo.items[1]).toBe(entities[1])
  })

  test('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'foo', price: 5 })
    await repo.insert(entity)
    const entities = await repo.findAll()
    expect(entities).toStrictEqual([entity])
  })

  test('should throws error on update when entity not found', async () => {
    const entity = new StubEntity({ name: 'foo', price: 5 })
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity),
    )
  })

  test('should updates an entity', async () => {
    const entity = new StubEntity({ name: 'foo', price: 5 })
    await repo.insert(entity)
    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: 'bar',
      price: 10,
    })
    await repo.update(entityUpdated)
    expect(entityUpdated.toJson()).toStrictEqual(repo.items[0].toJson())
  })

  test('should throws error on delete when entity not found', async () => {
    const uuid = new Uuid()
    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid, StubEntity),
    )
  })
})
