import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from db import UserOutWithPassword, UserOut
from queries import UserQueries


class UserAuthenticator(Authenticator):
    async def get_account_data(
        self,
        email: str,
        users: UserQueries,
    ):
        return users.get_user_by_email(email)

    def get_account_getter(
        self,
        users: UserQueries = Depends(),
    ):
        return users

    def get_hashed_password(self, user: UserOutWithPassword):

        return user['hashed_password']

    def get_account_data_for_cookie(self, user: UserOut):

        return user['email'], UserOut(id=user['id'], email=user['email'])


authenticator = UserAuthenticator(os.environ["SIGNING_KEY"])
