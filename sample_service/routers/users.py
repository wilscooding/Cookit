from fastapi import (
    APIRouter,
    Depends,
    Response,
    Request,
    HTTPException,
    status
    )
from db import (
    User,
    UserIn,
    UserOut,
    DuplicateUserError,
    UsersOut
)
from authenticator import authenticator
from db import HttpError, UserForm, UserToken
from queries import UserQueries



router = APIRouter()


@router.get("/api/users", response_model=UsersOut)
def users_list(queries: UserQueries = Depends()):
    return {
        "users": queries.get_all_users(),
    }
# comment

@router.get("/api/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: str,
    queries: UserQueries = Depends(),
):
    record = queries.get_user(user_id)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user with that id."
        )
    else:
        return record


@router.post("/api/users", response_model=UserToken | HttpError)
async def create_user(
    info: UserIn,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        user = queries.create_user(info, hashed_password)
    except DuplicateUserError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials."
        )
    form = UserForm(
        username=info.email,
        password=info.password
    )

    token = await authenticator.login(response, request, form, queries)
    return UserToken(user=user, **token.dict())


@router.put("/api/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user: User,
    queries: UserQueries = Depends(),
):
    record = queries.update_user(user_id, user)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user with that id."
        )
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
