import { useState } from "react"
import { Table } from "flowbite-react";


const GroceryList = ({currentUser}) => {
  const [groceryList, setGroceryList] = useState([]);

  const fetchWithCookie = () => {

  }

  return (
		<div>
			<div className="flex w-full h-screen">
				<div className="w-full flex justify-center h-full bg-gradient-to-tr from-orange-500 to-yellow-300">
					<div className="p-8">
						<Table striped>
							<Table.Head>
								<Table.HeadCell>Item</Table.HeadCell>
								<Table.HeadCell>Amount</Table.HeadCell>
								<Table.HeadCell>Notes</Table.HeadCell>
								<Table.HeadCell>
									<span className="sr-only">Edit</span>
								</Table.HeadCell>
							</Table.Head>
							<Table.Body className="divide-y">
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										Apples
									</Table.Cell>
									<Table.Cell>5</Table.Cell>
									<Table.Cell></Table.Cell>
									<Table.Cell>
										<a
											className="font-medium text-orange-400 hover:underline dark:text-orange-400"
											href="/tables"
										>
											<p>Edit</p>
										</a>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
export default GroceryList
