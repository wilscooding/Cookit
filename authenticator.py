import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from sample_service.routers.users import UserOutWithPassword, UserOut
from sample_service.db import UserQueries


class User_Authenticator(Authenticator):
    async def get_user_data(
        self,
        email: str,
        users: UserQueries,
    ):
        # Use your repo to get the account based on the
        # username (which could be an email)
        return users.get(email)

    def get_user_getter(
        self,
        users: UserQueries = Depends(),
    ):
        # Return the accounts. That's it.
        return users

    def get_hashed_password(self, account: UserOutWithPassword):
        # Return the encrypted password value from your
        # account object
        return account.hashed_password

    def get_account_data_for_cookie(self, account: UserOut):
        # Return the username and the data for the cookie.
        # You must return TWO values from this method.
        return account.username, UserOut(**account.dict())


authenticator = User_Authenticator(os.environ["SIGNING_KEY"])
