from fastapi import (
    APIRouter,
    Depends,
    Response,
    Request,
    HTTPException,
    status
    )
from db import (
    UserIn,
    UserOut,
    UserQueries,
    DuplicateUserError,
    UsersOut
)
from authenticator import authenticator
from jwtdown_fastapi.authentication import Token
from pydantic import BaseModel


class UserToken(Token):
    user: UserOut


class UserForm(BaseModel):
    id: int
    password: str


class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.get("/api/users", response_model=UsersOut)
def users_list(queries: UserQueries = Depends()):
    return {
        "users": queries.get_all_users(),
    }


@router.get("/api/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    response: Response,
    queries: UserQueries = Depends(),
):
    record = queries.get_user(user_id)
    if record is None:
        response.status_code = 404
    else:
        return record


@router.post("/api/users/", response_model=UserToken | HttpError)
async def create_user(
    user: UserIn,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
):
    hashed_password = authenticator.hash_password(user.password)
    try:
        u = queries.create_user(user, hashed_password)
        print(u)
        form = UserForm(
            id=u.id,
            password=u.password
        )
        token = await authenticator.login(response, request, form, queries)
        return UserToken(user=u, **token.dict())
    except DuplicateUserError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials."
        )


@router.put("/api/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_in: UserIn,
    response: Response,
    queries: UserQueries = Depends(),
):
    record = queries.update_user(user_id, user_in)
    if record is None:
        response.status_code = 404
    else:
        return record


@router.delete("/api/users/{user_id}", response_model=bool)
def delete_user(user_id: int, queries: UserQueries = Depends()):
    queries.delete_user(user_id)
    return True


@router.get("/token", response_model=UserToken | None)
async def get_token(
    request: Request,
    user: UserOut = Depends(authenticator.try_get_current_account_data)
) -> UserToken | None:
    if authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "user": user,
        }
