TiDB requires client certificates to be configured on a per-user basis. The requirement can be configured using `CREATE USER` or `ALTER USER` statements. When set, TiDB will reject connections from these users if they don't present a valid certificate signed by your CA.

```sql
mysql> CREATE USER 'myuser'@'%' REQUIRE SUBJECT 'CN={{ client_name }}';
mysql> ALTER USER 'myuser'@'%' REQUIRE SUBJECT 'CN={{ client_name }}';
```

You can [require other user certificate information](https://docs.pingcap.com/tidb/stable/certificate-authentication#get-user-certificate-information) in order to establish a connection.
