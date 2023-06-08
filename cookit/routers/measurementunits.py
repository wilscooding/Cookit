from typing import List
from fastapi import Depends, APIRouter
from db import MeasurementUnitIn, MeasurementUnitOut
from queries import MeasurementUnitQueries


router = APIRouter()


@router.post("/api/measurement_units/", response_model=MeasurementUnitOut)
def add_measurement_unit(
    measurement_unit: MeasurementUnitIn,
    queries: MeasurementUnitQueries = Depends(),
) -> MeasurementUnitOut:
    new_measurement_unit = queries.create_measurement_unit(measurement_unit)
    return new_measurement_unit


@router.get("/api/measurement_units/", response_model=List[MeasurementUnitOut])
def get_measurements_units(
    queries: MeasurementUnitQueries = Depends(),
) -> List[MeasurementUnitOut]:
    return queries.get_measurement_units()


@router.get("/api/measurement_units/{id}", response_model=MeasurementUnitOut)
def get_measurement_unit(
    id: int,
    queries: MeasurementUnitQueries = Depends(),
) -> MeasurementUnitOut:
    return queries.get_measurement_unit_by_id(id)


@router.put("/api/measurement_units/{id}", response_model=MeasurementUnitOut)
def update_measurement_unit_by_id(
    id: int,
    measurement_unit: MeasurementUnitIn,
    queries: MeasurementUnitQueries = Depends(),
) -> MeasurementUnitOut:
    return queries.update_measurement_unit(id, measurement_unit)


@router.delete("/api/measurement_units/{id}", response_model=bool)
def delete_measurement_unit_by_id(
    id: int,
    queries: MeasurementUnitQueries = Depends(),
):
    return queries.delete_measurement_unit(id)
