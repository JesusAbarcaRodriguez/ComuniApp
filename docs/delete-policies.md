# 🗑️ Enabling Event and Group Deletion

## Problem

The delete buttons are implemented in the app, but they won't work until the **Row Level Security (RLS) policies** are created in Supabase.

## Solution: run the SQL script in Supabase

### Step 1: Open the Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your **ComuniApp** project

### Step 2: Open the SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click **New query**

### Step 3: Copy and run the script

1. Open [`supabase/delete_policies.sql`](../supabase/delete_policies.sql)
2. Copy the **entire** file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (bottom-right corner)

### Step 4: Check the result

You should see a success message like:

```
Success. No rows returned
```

## What the script does

It creates two security policies:

| Policy | Rule |
| --- | --- |
| **Delete events** | Allowed if you are the **owner or an admin** of the event's group |
| **Delete groups** | Allowed **only** for the group **owner** |

## Additional checks

### 1. RLS is enabled

Run this in the SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('events', 'groups');
```

Both tables should show `rowsecurity = true`.

### 2. The policies exist

The end of the script includes verification queries that list the created policies.

## Still not working?

1. **Check the Postgres logs**
   - Dashboard → Logs → Postgres Logs
   - Look for `permission denied` or policy violation errors

2. **Check the `ON DELETE CASCADE` foreign keys**
   - Dashboard → Database → Tables → `events` → Foreign Keys
   - Every related foreign key should use `ON DELETE CASCADE`

3. **Test the delete manually**

   ```sql
   DELETE FROM events WHERE id = '<test-event-id>';
   ```

   - If this works but the app doesn't, the issue is in the app code.
   - If this fails, the issue is in the Supabase policies.

When reporting a problem, include the full error message, the table involved and a screenshot if possible.
