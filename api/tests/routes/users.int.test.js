require('../init');

describe(':users', () => {
  test('[POST /users/register] Should register new user', async () => {
    const response = await client.post('/users/register', {
      email: 'new_user@test.com',
      password: 'password',
      firstName: 'new_user_name',
      lastName: 'new_user_lastname',
    });
    expect(response.body.user).toBeDefined();
  });
  test('[GET /] Should get all profiles', async () => {
    const response = await client.get('/users');
    expect(response.body.users).toHaveLength(2);
  });
});
