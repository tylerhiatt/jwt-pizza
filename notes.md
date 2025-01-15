# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |     home.tsx       |      _none_       |    _none_    |
| Register new user<br/>(t@jwt.com, pw: test)         |    register.tsx    | [POST] /api/auth  | INSERT INTO user (name, email, password) VALUES (?, ?, ?)<br/>INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Login new user<br/>(t@jwt.com, pw: test)            |     login.tsx      |  [PUT] /api/auth  | INSERT INTO auth (token, userId) VALUES (?, ?) |
| Order pizza                                         |     menu.tsx       | [POST] /api/order | INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())<br/>INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?) |
| Verify pizza                                        |    delivery.tsx    | [POST] /api/order/verify |  _none_ (Request is verified via pizza factory, not in pizza service db) |
| View profile page                                   | dinerDashboard.tsx | [GET] /api/order  | SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ?,?<br/>SELECT id, menuId, description, price FROM orderItem WHERE orderId=? |
| View franchise<br/>(as diner)                       | franchiseDashboard.tsx | [GET] /api/franchise/:userId | SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?<br/>SELECT id, name FROM franchise WHERE id in (?)|
| Logout                                              |     logout.tsx     | [DELETE] /api/auth | DELETE FROM auth WHERE token=? |
| View About page                                     |     about.tsx      |      _none_       |     _none_    |
| View History page                                   |     history.tsx    |      _none_       |     _none_    |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |     login.tsx      | [PUT] /api/auth   | INSERT INTO auth (token, userId) VALUES (?, ?) |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.tsx | [GET] /api/franchise/:userId | SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?<br/>SELECT id, name FROM franchise WHERE id in (?) |
| Create a store                                      |   createStore.tsx  | [POST] /api/franchise/:franchiseId/store | INSERT INTO store (franchiseId, name) VALUES (?, ?) |
| Close a store                                       |   closeStore.tsx   | [DELETE] /api/franchise/:franchiseId/store/:storeId | DELETE FROM store WHERE franchiseId=? AND id=? |
| Login as admin<br/>(a@jwt.com, pw: admin)           |      login.tsx     | [PUT] /api/auth  | INSERT INTO auth (token, userId) VALUES (?, ?) |
| View Admin page                                     | adminDashboard.tsx | [GET] /api/franchise | SELECT id, name FROM franchise<br/>SELECT id, name FROM store WHERE franchiseId=? |
| Create a franchise for t@jwt.com                    | createFranchise.tsx | [POST] /api/franchise | INSERT INTO franchise (name) VALUES (?)<br/>INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Close the franchise for t@jwt.com                   | closeFranchise.tsx  | [DELETE] /api/franchise/:franchiseId | DELETE FROM store WHERE franchiseId=?<br/>DELETE FROM userRole WHERE objectId=?<br/>DELETE FROM franchise WHERE id=? |