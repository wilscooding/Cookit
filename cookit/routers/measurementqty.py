from typing import List
from fastapi import APIRouter, Depends
from db import MeasurementQtyIn, MeasurementQtyOut
from queries import MeasurementQtyQueries


router = APIRouter()


@router.post("/api/measurement_qty/", response_model=MeasurementQtyOut)
def add_measurement_qty(
    measurement_qty: MeasurementQtyIn,
    queries: MeasurementQtyQueries = Depends(),
) -> MeasurementQtyOut:
    new_measurement_qty = queries.create_measurement_qty(measurement_qty)
    return new_measurement_qty


@router.get("/api/measurement_qty/", response_model=List[MeasurementQtyOut])
def get_measurements_qty(
    queries: MeasurementQtyQueries = Depends(),
) -> List[MeasurementQtyOut]:
    return queries.get_measurement_qty()


@router.get("/api/measurement_qty/{id}", response_model=MeasurementQtyOut)
def get_measurement_qty(
    id: int,
    queries: MeasurementQtyQueries = Depends(),
) -> MeasurementQtyOut:
    return queries.get_measurement_qty_by_id(id)


@router.put("/api/measurement_qty/{id}", response_model=MeasurementQtyOut)
def update_measurement_qty_by_id(
    id: int,
    measurement_qty: MeasurementQtyIn,
    queries: MeasurementQtyQueries = Depends(),
) -> MeasurementQtyOut:
    return queries.update_measurement_qty(id, measurement_qty)


@router.delete("/api/measurement_qty/{id}", response_model=bool)
def delete_measurement_qty_by_id(
    id: int,
    queries: MeasurementQtyQueries = Depends(),
) -> bool:
    return queries.delete_measurement_qty(id)
