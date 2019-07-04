# Migration `watch-20190704140312`

This migration has been generated at 7/4/2019, 2:03:12 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_User"("id" TEXT NOT NULL  ,"name" TEXT NOT NULL DEFAULT '' ,"email" TEXT NOT NULL DEFAULT '' ,PRIMARY KEY ("id"));

INSERT INTO "new_User" ("id","name") SELECT "id","name" from "User"

DROP TABLE "lift"."User";

ALTER TABLE "lift"."new_User" RENAME TO "User";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20190704140227..watch-20190704140312
--- datamodel.dml
+++ datamodel.dml
@@ -8,8 +8,8 @@
   provider = "photonjs"
 }
 model User {
-  id   String @default(uuid()) @id @unique
-  name String
-  mail String @unique
+  id    String @default(uuid()) @id @unique
+  name  String
+  email String @unique
 }
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190704140312)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190704140312'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
