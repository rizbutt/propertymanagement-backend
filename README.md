
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.



## API Documentation

### GET /api/health
- **Description**: Check the status of server whether is running
- **Response**:
- **200 OK**: The server is running



### POST /api/auth/register
- **Description**: To register the user 
- **Request Body**:
- **email**: The email of user
- **password**: The password of user
- **Response**:
- **201 OK**: The user is created successfully
- **400 Bad Request**: Email already in use



### POST /api/auth/login
- **Description**: To login the user 
- **Request Body**:
- **email**: The email of user
- **password**: The password of user
- **Response**:
- **200 OK**: The user is login successfully
- **401 unauthorized**: Invalid credentials



### POST /api/forget-password
- **Description**: To send token email to user
- **Request Body**:
-**email**: email of user
- **Response**:
- **201 OK**: The  email token is sent successfully
- **400 Bad Request**: Email not found



### POST /api/reset-password
- **Description**: user will enter the token from his email inbox and enter the token to reset prev password
- **Request Body**:
-**token**: token from email
- **newPassword**: new password
- **Response**:
- **201 OK**: The password is reset successfully
- **400 Bad Request**: Invalid token OR token expired



### POST /api/tenant
- **Description**: To create a new tenant
- **Request Body**:
- **name**: name of tenant
- **building_no** : property_no from property in string
- **building_name**: building name of that property no in string
- **monthly_rent**: monthly rent of tenant in number
- **security**: number of amount deposit at that time
- **passport_no**: passport  no in string
- **building_address**: building_address from property in string
- **contact_no**: contact number of tenant in string
- **sectionName**: sectionName of that propertyno in string
- **Response**:
- **201 OK**: The tenant is created successfully
- **400 Bad Request**: user id not found use bearer token in auth



### GET /api/tenant
- **Description**: To get all tenants
- **Response**:
- **200 OK**: The tenants names[] are fetched successfully
- **400 Bad Request**: user id not found use bearer token in auth



### POST /api/rent
- **Description**: To create a new rent 
- **Request Body**:
- **building_no** : property_no from property in string
- **building_name**: monthly rent of tenant in number
- **tenant_name**: tenant name from tenants  in string
- **room_no**: room no in number
- **collection_date**: Date of collection of rent 
- **dues**: dues of rent in number
- **notes**: notes any in string
- **Response**:
- **201 OK**: The rent is created successfully
- **400 Bad Request**: user id not found use bearer token in auth



### POST /api/property
- **Description**: To create a new property
- **Request Body**:
- **propertyNo** : property_no from property in string
- **OwnerName**: OWNER NAME in string 
- **property_name**: property name from in string
- **property_type**: like 'Villa' | 'Building' | 'Commercial' in string
- **address**: address of owner in string
- **contractDuration**: {
    **from**: "Date",
    **to**: "Date"
}
- **totalAmount**: total amount in number
- **noOfInstallments**: no of installments in number
- **bills**:[{
    **type**: like bills of elect, gas and water etc in string
    **accountNo**: acccount no in string
}]
- **ownership_type**: like Owned or rented in string
- **user_document**: user document of either owned or rented {
    data: Buffer; // Binary data for the file
    contentType: string; // MIME type of the file
  }
- **building_images**: building images [{ 
    data: Buffer; // Path to the image file
    contentType: string; // MIME type of the file
    description?: string; // Optional description or metadata
  }] 
- **building_details**:{
    name:string,
    address:string,
    rooms: number;
    kitchens: number;
    lobbies: number;
    bathrooms: number;
    bedrooms:number;
    additionalFeatures?: string;
  };  
- **Response**:
- **201 OK**: The property is created successfully
- **400 Bad Request**: user id not found use bearer token in auth



### GET /api/property
- **Description**: To get all properties property_no[],building_names[] and building_address
- **Response**:
- **200 OK**: The property data got.
- **400 Bad Request**: user id not found use bearer token in auth



### POST /api/property/section
- **Description**: To create a new section in existing property
- **Request Body**:
- **propertyNo**: property_no from property in string
- **sectionName**: section name in string
- **sectionType**: section type in string like shared or single
- **rooms**: section area in number
- **bathrooms**: bathrooms number in number
- **kitchens**: kitchens number in number
- **lobbies**: lobbies number in number
- **bedrooms**: bedrooms number in number
- **Response**:
- **201 OK**: The section is created successfully
- **400 Bad Request**: user id not found use bearer token in auth



### GET /api/property/section?propert_no=123
- **Description**: To get all sections of a property with user id
- **Response**:
- **200 OK**: The section data got.
- **400 Bad Request**: user id not found use bearer token in auth
- **404 Not Found**: property not exist


### POST /api/expense
- **Description**: To create a new expense in existing property
- **Request Body**:
- **building_no**: property_no from property in string
- **building_name**: building name in string,
- **receipt_no**: receipt no in string, 
- **item_no**: item no in number,
- **item_quantity**: item quantity in number
- **amount**: total expense in number, 
- **payment_date**: payement_date in Date, 
- **payment_purpose**: payment purpose in string,
- **sectionName**: section name in string,
- **Response**:
- **201 OK**: The expense is created successfully
- **400 Bad Request**: user id not found use bearer token in auth
