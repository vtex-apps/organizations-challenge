# Organizations Challenge

> Challenge that checks if a user is permitted to view the content, based on its Organizations

## Usage

Add this app to your theme dependencies:

```js
// manifest.json
// ...
  "dependencies": {
    // ...
    "vtex.organizations-challenge": "1.x"
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
> - go to `manifest.json` in your project's root directory and change `vendor` to your current vendor name (i.e: `"vendor": "vtexufcg"`)
> - update the `version` in `manifest.json` if you have published the same version earlier
> - install that published version to your workspace (`vtex install vtex.vtex.organizations-challenge`)

## Prerequisites

In order to run this application following master data schemas should be created. 
Use `MASTER DATA API - V2` in vtex api documentation to create those schemas (https://developers.vtex.com/reference#master-data-api-v2-overview)

These schemas are shared among several applications `vtex.admin-organizations`, `vtex.organizations-challenge` and `vtex.organizations`, therefore if you have already created these schemas you can ignore this step

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

<details><summary>UserOrganization</summary>

``` 

Data Entity Name: UserOrganization
Schema Name: user-organization-schema-v1

{
	"properties": {
		"email": {
			"type": "string"
		},
		"businessOrganizationId": {
			"type": "string",
			"link": "http://api.vtex.com/{{accountName}}/dataentities/BusinessOrganization/schemas/business-organization-schema-v1"
		},
		"roleId": {
			"type": "string",
			"link": "http://api.vtex.com/{{accountName}}/dataentities/BusinessRole/schemas/business-role-schema-v1"
		},
		"status": {
			"type": "string"
		}
	},
	"v-default-fields": [
		"email",
		"id",
		"businessOrganizationId",
		"roleId",
		"status"
	],
	"required": [
		"email",
		"businessOrganizationId",
		"roleId",
		"status"
	],
	"v-indexed": [
		"email",
		"businessOrganizationId",
		"roleId",
		"status"
	],
	"v-security": {
		"allowGetAll": true,
		"publicRead": [
			"email",
			"id",
			"businessOrganizationId",
			"businessOrganizationId_linked",
			"roleId",
			"roleId_linked",
			"status"
		],
		"publicWrite": [
			"id",
			"email",
			"businessOrganizationId",
			"roleId",
			"status"
		],
		"publicFilter": [
			"email",
			"id",
			"businessOrganizationId",
			"roleId",
			"status"
		]
	},
	"v-triggers": [
		{
			"name": "organization-assignment-accept-email",
			"active": true,
			"condition": "status=APPROVED",
			"action": {
				"type": "email",
				"provider": "default",
				"subject": "Organization Assignment Acceptance",
				"to": [
					"{!email}"
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
			"name": "organization-assignment-decline-email",
			"active": true,
			"condition": "status=DECLINED",
			"action": {
				"type": "email",
				"provider": "default",
				"subject": "Organization Assignment Decline",
				"to": [
					"{!email}"
				],
				"bcc": [
					"jayendra@clouda.io",
					"sahan@clouda.io"
				],
				"replyTo": "noreply@company.com",
				"body": "You have left the organization {!businessOrganizationId_linked.name}."
			}
		}
	]
}

```
</details>

### Changes to existing **CL** table
We need to add two fields to existing **CL** master data table. 
```
isOrgAdmin: Boolean 
organizationId: VarChar 100
```
After creating the fields change settings of that fields with edit field feature.
You can update the field settings as shown in the image below. 

<a href="https://drive.google.com/uc?export=view&id=1IzMTKBpB4A9snERILSQJ-DQd1Zp758wE">View Image</a>

>**_NOTE:_** **isOrgAdmin** field should check following checkboxes 
> **Make readable without credential**, 
> **Is searchable**, 
> **Is filterable**, 

> **organizationId** field should check following checkboxes 
> **Is nullable**, 
> **Make readable without credential**, 
> **Allow editing without credential**, 
> **Allow filter without credential**, 
> **Is searchable**, 
> **Is filterable**, 

Dont forget to `save` and `reindex` `CL` table once you add all the fields. 


## Instructions

### Block level changes
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

### Site editor changes
You should give list of permissions to `challenge-permission` block from site editor to allow or dis-allow relevent blocks. 

- Go to site editor in admin pannel
- Find the relevent `challenge-permission` block 
- Click on that block then you will get a option to add permissions

Then this component will check if the user has permission to see the `allowed-content`, otherwise he will see the `disallowed-content`.

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
