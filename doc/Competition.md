# Competition (/competition)
## Create
### Path
```
POST /competition
```
### Request
```json
{
  "data": {
    "name": "string (Name of the competition)",
    "description": "string",
    "location": "string (Where the competition is hosted)",
    "rounds": [
      {
        "start": "Date (when the round starts)",
        "end": "Date (when the round ends)"
      }
    ]
  }
}
```
### Response
```json
{
  "tasks": [
    [],
  ],
  "_id": "string (Identifier of the competition)",
  "name": "string",
  "description": "string",
  "location": "string",
  "rounds": [
    {
      "start": "Date",
      "end": "Date"
    },
  ]
}
```
## Get all
### Path
```
GET /competition
```
### Request
```json
{
  //empty, will add pagination soon
}
```
### Response
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "location": "string",
    "rounds": [
      {
        "start": "Date",
        "end": "Date"
      }
    ]
  }
]
```
## Get by ID
### Path
```
GET /competition/id
```
### Request
```json
{
  "id": "string (_id field of the competition")
}
```
### Response
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "location": "string",
  "rounds": [
    {
      "start": "Date",
      "end": "Date"
    }
  ]
}
```
## Update
### Path
```
PUT /competition
```
### Request
```json
{
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "location": "string",
    "rounds": [
      {
      	"start": "Date",
      	"end": "Date"
      }
    ],
  }
}
```
### Response
```json
{
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "location": "string",
    "rounds": [
      {
      	"start": "Date",
      	"end": "Date"
      }
    ],
  }
}
```
## Remove
### Path
```
DELETE /competition
```
### Request
```json
{
  "id": "string (_id field of the competition")
}
```
### Response
```json
{
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "location": "string",
    "rounds": [
      {
      	"start": "Date",
      	"end": "Date"
      }
    ],
  }
}
```