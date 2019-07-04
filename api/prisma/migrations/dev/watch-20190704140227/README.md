# Migration `watch-20190704140227`

This migration has been generated at 7/4/2019, 2:02:27 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "file:dev"."User"("id" TEXT NOT NULL  ,"name" TEXT NOT NULL DEFAULT '' ,"mail" TEXT NOT NULL DEFAULT '' ,PRIMARY KEY ("id"));
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..watch-20190704140227
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,15 @@
+datasource db {
+  provider = "sqlite"
+  url      = "file:dev.db"
+  default  = true
+}
+
+generator photon {
+  provider = "photonjs"
+}
+
+model User {
+  id   String @default(uuid()) @id @unique
+  name String
+  mail String @unique
+}
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190704140227)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190704140227'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
