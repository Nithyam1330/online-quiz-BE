import { IsDefined, MinLength } from 'class-validator';

export class AddressDTO {
    @IsDefined()
    type: string;

    @IsDefined()
    country: string;

    @IsDefined()
    state: string;

    @IsDefined()
    city: string;

    @IsDefined()
    street: string;

    @IsDefined()
    landmark: string;

    @IsDefined()
    pincode: number;

    address_id?: string;
}
export class UsersDetailsDto {
    _id?: string;

    @IsDefined()
    @MinLength(3)
    firstName: string;

    @IsDefined()
    @MinLength(3)
    lastName: string;

    profilePicture: string;

    @IsDefined()
    phoneNumber: number;

    @IsDefined()
    gender_id: number;

    userId: string;
    fullName: string;
}
