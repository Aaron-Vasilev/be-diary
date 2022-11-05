import { test } from "@jest/globals"
import { sequelize } from "../db"

test('Connection to DB', async () => {
  try {
    const connection = await sequelize.authenticate()
    expect(connection).toBeTruthy()
  } catch (error) {
    throw error
  }
})