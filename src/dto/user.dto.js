export class UserResponseDto {
    constructor({name, lastName, email, cart, age, role}){
      this.first_name = name;
      this.last_name = lastName;
      this.email = email;
      this.cart = cart;
      this.age = age;
      this.role = role;
      this.full_name = `${name} ${lastName}`
    }
  }