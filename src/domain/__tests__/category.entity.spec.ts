import { Category } from '../category.entity';

describe('Category Unit Tests', () => {
  describe('constructor', () => {
    it('should create a category with default values', () => {
      const created_at = new Date();
      const category = new Category({
        name: 'Movie',
        created_at
      })
      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBe(true)
      expect(category.created_at).toBeInstanceOf(Date)
    })

    it('should create a category with custom values', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at
      })
      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('some description')
      expect(category.is_active).toBe(false)
      expect(category.created_at).toBeInstanceOf(Date)
    })

    it( 'should create a category with all values', () => {
      const created_at = new Date()
      const category = new Category({
        category_id: 1,
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at
      })
      expect(category.category_id).toBe(1)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('some description')
      expect(category.is_active).toBe(false)
      expect(category.created_at).toBeInstanceOf(Date)
    })

    it('should create a category with name and description', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'some description',
        created_at
      })
      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('some description')
      expect(category.is_active).toBe(true)
      expect(category.created_at).toBeInstanceOf(Date)
    })
  })


  describe('create command', () => {
    it('should create a category with default values', () => {
      const category = Category.create({
        name: 'Movie',

      })
      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBe(true)
    })

    it('should create a category with custom values', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'some description',
        is_active: false
      })
      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('some description')
      expect(category.is_active).toBe(false)
    })
  })

  describe('change method', () => {
    it('should change name', () => {
      const category = new Category({
        name: 'Movie',
        created_at: new Date()
      })
      category.changeName('New Movie')
      expect(category.name).toBe('New Movie')
    })

    it('should change description', () => {
      const category = new Category({
        name: 'Movie',
        created_at: new Date()
      })
      category.changeDescription('New description')
      expect(category.description).toBe('New description')
    })
  })

  describe('activate and desactive methods', () => {
    it('should activate category', () => {
      const category = new Category({
        name: 'Movie',
        created_at: new Date(),
        is_active: false
      })
      category.activate()
      expect(category.is_active).toBe(true)
    })
    it('should deactivate category', () => {
      const category = new Category({
        name: 'Movie',
        created_at: new Date(),
        is_active: true
      })
      category.deactivate()
      expect(category.is_active).toBe(false)
    })
  })

  describe('toJSON method', () => {
    it('should return a JSON representation of the category', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at
      })
      const json = category.toJSON()
      expect(json.category_id).toBeUndefined()
      expect(json.name).toBe('Movie')
      expect(json.description).toBe('some description')
      expect(json.is_active).toBe(false)
      expect(json.created_at).toEqual(created_at)
    })
  })
})
