create schema if not exists "_analytics";


alter table "auth"."users" add column "deleted_at" timestamp with time zone;

alter table "auth"."users" alter column "phone" set data type text using "phone"::text;

alter table "auth"."users" alter column "phone_change" set data type text using "phone_change"::text;


create extension if not exists "pg_net" with schema "extensions";


CREATE UNIQUE INDEX rooms_pkey ON public.rooms USING btree (id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

alter table "public"."rooms" add constraint "rooms_pkey" PRIMARY KEY using index "rooms_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."teams" add constraint "teams_room_fkey" FOREIGN KEY (room) REFERENCES rooms(id) ON DELETE CASCADE not valid;

alter table "public"."teams" validate constraint "teams_room_fkey";


alter table "storage"."buckets" add column "allowed_mime_types" text[];

alter table "storage"."buckets" add column "avif_autodetection" boolean default false;

alter table "storage"."buckets" add column "file_size_limit" bigint;

alter table "storage"."objects" add column "version" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$function$
;


