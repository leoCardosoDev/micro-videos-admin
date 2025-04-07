import { InvalidUuidError, Uuid } from '../uuid.vo'
import { validate as uuidValidate } from 'uuid'

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')
  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid_uuid')
    }).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid UUID', () => {
    const uuid = new Uuid()
    expect(uuid.id).toBeDefined()
    expect(uuid.id.length).toBe(36)
    expect(uuidValidate(uuid.id)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should accept a valid uuid', () => {
    const uuid = new Uuid('d3c37f6c-8a9c-4d15-afae-5885c81407a9')
    expect(uuid.id).toBe('d3c37f6c-8a9c-4d15-afae-5885c81407a9')
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
