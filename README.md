# Forum App frontend

React frontend built with Vite and TypeScript.

## Development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend API
URL when needed.

### Image uploads

Post images use a backend-authorized direct upload so provider credentials and
storage details stay out of the frontend. Configure:

```sh
VITE_IMAGE_UPLOAD_ENDPOINT=/uploads
VITE_MAX_IMAGE_UPLOAD_MB=10
```

The frontend first sends JSON metadata to the upload endpoint:

```json
{ "fileName": "photo.jpg", "contentType": "image/jpeg", "size": 12345 }
```

The endpoint returns `uploadId`, `method: "PUT"`, `uploadUrl`, and any required
`headers`. The frontend PUTs the raw file directly to that signed URL, calls
`POST /uploads/:uploadId/complete`, and saves `imageId: uploadId` on the post.
The backend must repeat file type and size validation; browser validation is
only a usability and first-line safety check.

## Production build

```sh
npm run build
npm run preview
```
