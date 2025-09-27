import prisma from "@/lib/prisma";

export async function getCustomers() {
  return prisma.customer.findMany();
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: {
      id
    }
  });
}

type CreateCustomer = {
  name: string
}

export async function createCustomer(customer: CreateCustomer) {
  return prisma.customer.create({
    data: customer
  });
}

type UpdateCustomer = {
  name?: string
}

export async function updateCustomer(id: string, customer: UpdateCustomer) {
  return prisma.customer.update({
    where: { id },
    data: customer
  });
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({
    where: { id }
  });
}