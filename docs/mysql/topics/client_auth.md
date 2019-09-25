MySQL requires client certificates on a per-user basis. The requirement can be configured using `CREATE USER` or `ALTER USER` statements.

```sql
mysql> CREATE USER 'myuser'@'myhost' REQUIRE X509;
mysql> ALTER USER 'myuser'@'myhost' REQUIRE X509;
```
