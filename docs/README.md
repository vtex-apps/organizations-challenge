# Permission Challenge

> Challenge that checks if a user is permitted to view the content

## Usage

Add this app to your theme dependencies:

```js
// manifest.json
// ...
  "dependencies": {
    // ...
    "vtex.challenge-permission": "0.x"
  }
```

> **_NOTE:_**  These applications are not yet published under `vtex` vendor name, therefore you have to publish this app with your own vendor name or you have to `link` this app to your development workspace directly.
>
> ### Link application to development workspace
> - clone the application to your working environment and checkout to the correct branch (i.e: `master`)
> - link this app to your workspace (`vtex link --verbose`)
>
> ### publish with your vendor name
> - clone the application to your working environment and checkout to the correct branch (i.e: `master`)
> - go to `manufest.json` in your project's root directory and change `vendor` to your current vendor name (i.e: `"vendor": "biscoindqa"`)
> - update the `version` in `manufest.json` if you have published the same version earlier
> - install that published version to your workspace (`vtex install biscoindqa.vtex-permission-challenge`)

## Prerequisites

In order to run this application following master data schemas should be created. 
Use `MASTER DATA API - V2` in vtex api documentation to create those schemas (https://developers.vtex.com/reference#master-data-api-v2-overview)

These schemas are shared among several applications `vtex-admin-authorization`, `vtex-permission-challenge` and `vtex-my-organization`, therefore if you have already created these schemas you can ignore this step

<details><summary>BusinessPermission</summary>

``` 

Data Entity Name: BusinessPermission
Schema Name: business-permission-schema-v1

{
	"properties": {
		"name": {
			"type": "string"
		},
		"label": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"name",
		"label",
		"id"
	],
	"required": [
		"name"
	],
	"v-indexed": [
		"name"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"name",
			"label",
			"id"
		],
		"publicWrite": [
			"name",
			"label"
		],
		"publicFilter": [
			"name",
			"id"
		]
	}
}

```
</details>

<details><summary>BusinessRole</summary>

``` 

Data Entity Name: BusinessRole
Schema Name: business-role-schema-v1

{
	"properties": {
		"name": {
			"type": "string"
		},
		"label": {
			"type": "string"
		},
		"permissions": {
			"type": "string"
		}
	},
	"definitions": {
		"permission": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"name",
		"label",
		"id",
		"permissions"
	],
	"required": [
		"name"
	],
	"v-indexed": [
		"name"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"name",
			"label",
			"permissions",
			"id"
		],
		"publicWrite": [
			"name",
			"label",
			"permissions"
		],
		"publicFilter": [
			"name",
			"id"
		]
	}
}
```
</details>

<details><summary>Persona</summary>

``` 

Data Entity Name: Persona
Schema Name: persona-schema-v1

{
	"properties": {
		"businessOrganizationId": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/BusinessOrganization/schemas/business-organization-schema-v1"
		},
		"email": {
			"type": "string",
			"format": "email"
		}
	},
	"v-default-fields": [
		"id",
		"businessOrganizationId",
		"businessOrganizationId_linked",
		"email"
	],
	"required": [
		"businessOrganizationId",
		"email"
	],
	"v-indexed": [
		"businessOrganizationId",
		"email"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"id",
			"businessOrganizationId",
			"businessOrganizationId_linked",
			"email"
		],
		"publicWrite": [
			"businessOrganizationId",
			"email"
		],
		"publicFilter": [
			"id",
			"businessOrganizationId",
			"email"
		]
	}
}

```
</details>

<details><summary>BusinessOrganization</summary>

``` 

Data Entity Name: BusinessOrganization
Schema Name: business-organization-schema-v1

{
	"properties": {
		"name": {
			"type": "string"
		},
		"telephone": {
			"type": "string"
		},
		"address": {
			"type": "string"
		},
		"email": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"name",
		"telephone",
		"id",
		"address",
		"email"
	],
	"required": [
		"name",
		"telephone"
	],
	"v-indexed": [
		"name",
		"telephone",
		"email"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"name",
			"telephone",
			"id",
			"address",
			"email"
		],
		"publicWrite": [
			"name",
			"telephone",
			"address",
			"email"
		],
		"publicFilter": [
			"name",
			"telephone",
			"id",
			"email"
		]
	}
}

```
</details>

<details><summary>OrgAssignment</summary>

``` 

Data Entity Name: OrgAssignment
Schema Name: organization-assignment-schema-v1

{
	"properties": {
		"personaId": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/Persona/schemas/persona-schema-v1"
		},
		"personaEmail": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/Persona/schemas/persona-schema-v1",
			"linked_field": "email"
		},
		"businessOrganizationId": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/BusinessOrganization/schemas/business-organization-schema-v1"
		},
		"businessOrganizationName": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/BusinessOrganization/schemas/business-organization-schema-v1",
			"linked_field": "name"
		},
		"roleId": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/BusinessRole/schemas/business-role-schema-v1"
		},
		"roleName": {
			"type": "string",
			"link": "http://api.vtex.com/biscoindqa/dataentities/BusinessRole/schemas/business-role-schema-v1",
			"linked_field": "name"
		},
		"status": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"personaId",
		"personaEmail",
		"id",
		"businessOrganizationId",
		"businessOrganizationName",
		"roleId",
		"roleName",
		"status"
	],
	"required": [
		"personaId",
		"businessOrganizationId",
		"roleId",
		"status"
	],
	"v-indexed": [
		"personaId",
		"businessOrganizationId",
		"roleId",
		"status"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"personaId",
			"personaId_linked",
			"personaEmail",
			"id",
			"businessOrganizationId",
			"businessOrganizationId_linked",
			"businessOrganizationName",
			"roleId",
			"roleId_linked",
			"roleName",
			"status"
		],
		"publicWrite": [
			"id",
			"personaId",
			"businessOrganizationId",
			"roleId",
			"status"
		],
		"publicFilter": [
			"personaId",
			"personaEmail",
			"id",
			"businessOrganizationId",
			"businessOrganizationName",
			"roleId",
			"roleName",
			"status"
		]
	},
	"v-triggers": [
		{
			"name": "organization-assignment-email",
			"active": true,
			"condition": "status=PENDING",
			"action": {
				"type": "email",
				"provider": "default",
				"subject": "Organization Assignment",
				"to": [
					"{!personaId_linked.email}"
				],
				"bcc": [
					"jayendra@clouda.io",
					"sahan@clouda.io"
				],
				"replyTo": "noreply@company.com",
				"body": "You have been assigned to {!businessOrganizationId_linked.name}."
			}
		},
		{
			"name": "organization-assignment-accept-email",
			"active": true,
			"condition": "status=APPROVED",
			"action": {
				"type": "email",
				"provider": "default",
				"subject": "Organization Assignment Acceptance",
				"to": [
					"{!personaId_linked.email}"
				],
				"bcc": [
					"jayendra@clouda.io",
					"sahan@clouda.io"
				],
				"replyTo": "noreply@company.com",
				"body": "You have accepted the invitation to join {!businessOrganizationId_linked.name}."
			}
		},
		{
			"name": "organization-assignment-decline-email",
			"active": true,
			"condition": "status=DECLINED",
			"action": {
				"type": "email",
				"provider": "default",
				"subject": "Organization Assignment Decline",
				"to": [
					"{!personaId_linked.email}"
				],
				"bcc": [
					"jayendra@clouda.io",
					"sahan@clouda.io"
				],
				"replyTo": "noreply@company.com",
				"body": "You have declined the invitation to join {!businessOrganizationId_linked.name}."
			}
		}
	]
}

```
</details>

## Instructions

Wrap the blocks you want to be visible only to logged in users with `challenge-permission`.

Example:

```diff
 "store.product": {
   "blocks": [
     "flex-layout.row#product-main",
+     "challenge-permission#description",
     "shelf.relatedProducts#accessories"
   ],
 },
+ "challenge-permission#description": {
+   "blocks": [
+     "allowed-content#description",
+     "disallowed-content#description"
+   ]
+ },
+ "allowed-content#description": {
+   "children": [
+     "product-description"
+   ]
+ },
+ "disallowed-content#description": {
+   "children": [
+     "rich-text#challenge-description"
+   ]
+ },
+ "rich-text#challenge-description": {
+   "props": {
+     "text": "You are not allowed to view the description",
+     "blockClass": "challengeDescription"
+   }
+ }
```

This component will check if the user has permission see the `allowed-content`, otherwise he will see the `disallowed-content`.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.challenge-permission.css` inside the `styles/css` folder. Add your custom styles:

```css
.challengeContentWrapper {
  margin-top: 10px;
}
```

#### CSS namespaces

Below, we describe the namespaces that are defined in the `PermissionChallenge`.

| Class name               | Description                                                                    | Component Source                                                                             |
| ------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `challengeContentWrapper`              | The main container of the `Content`                              |  |
