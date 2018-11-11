# project.04

Routes:

- Auth
  - POST /register
    - Registers a user with: nickname, email, password, password_confirmation
  - POST /login
    - Logs in with: nickname, password
- Users
  - GET /
    - Lists all users
  - GET /:uuid
    - Lists user info
  - DELETE /:uuid
    - Deletes a user
  - PUT /:uuid
    - Changes user info
- Buckets
  - GET /
    - Lists user specific buckets
  - GET /:id
    - Lists id specific bucket data + blobs contained in bucket
  - HEAD /:id
    - Returns 200 if bucket exists, 400 if not
  - POST /
    - Creates a new bucket with: name
  - PUT /:id
    - Changes a bucket with: name
  - DELETE /:id
    - Delete a bucket
- Blobs
  - POSTS /
    - Creates a new blob with: file uploaded
  - POST /duplicate/:id
    - Duplicates a blob
  - GET /
    - Lists all blobs for a specific bucket
  - GET /metadata/:id
    - Lists a blob metadata
  - GET /:id
    - Lists a blob
  - GET /download/:id
    - Downloads a blob
  - DELETE /:id
    - Deletes a blob

### Installation

requires node v10+

```sh
$ npm install
$ npm run dev
```

create and fill .env with:

> > PORT
> > APP
> > DATABASE_URL
> > MAILER_HOST
> > MAILER_PORT
> > JWT_ENCRYPTION

APP should be development, DATABASE used on development was postgres
for emails sent on register, run a local MailDev server

![alt text](https://media.giphy.com/media/WiM5K1e9MtEic/giphy.gif)
