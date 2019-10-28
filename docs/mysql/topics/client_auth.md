MySQL requires client certificates on a per-user basis. The requirement can be configured using `CREATE USER` or `ALTER USER` statements. When set, MySQL will reject connections from these users if they don't present a valid certificate signed by your CA.

```sql
mysql> CREATE USER 'myuser'@'myhost' REQUIRE SUBJECT 'CN={{ client_name }}';
mysql> ALTER USER 'myuser'@'myhost' REQUIRE SUBJECT 'CN={{ client_name }}';
```
