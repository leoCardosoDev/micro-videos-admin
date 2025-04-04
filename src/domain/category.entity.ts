export type CategoryConstructorPops = {
  category_id?: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at: Date;
}

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export class Category {
  category_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorPops) {
    this.category_id = props.category_id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at;
  }

  // Factory Method
  static create(props: CategoryCreateCommand): Category { // eventos de dominio
    return new Category(props);
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeDescription(description: string | null): void {
    this.description = description;
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  toJSON(): CategoryConstructorPops {
    return {
      category_id: this.category_id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
// projeto é o código e o código é o projeto
}
