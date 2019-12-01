CREATE TABLE "contacts" (
    "contact_id" INTEGER PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL UNIQUE
);
INSERT INTO `contacts` VALUES (NULL, "first_name", "last_name", "email", "phone"), (NULL, "Mohamad", "Rahimi", "mohammad@emai.com", "078675432");

CREATE TABLE "people" (
	 "person_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	 "first_name" TEXT(255,0) NOT NULL,
	 "last_name" TEXT(255,0) NOT NULL
);
CREATE INDEX "first_name_index" ON people ("first_name" COLLATE NOCASE ASC);
CREATE INDEX "last_name_index" ON people ("last_name" COLLATE NOCASE ASC);
INSERT INTO `people` VALUES (NULL, "Jango", "Reinhardt"), (NULL, "Svend", "Asmussen");

