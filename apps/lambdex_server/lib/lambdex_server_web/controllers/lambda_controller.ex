defmodule LambdexServerWeb.LambdaController do
  use LambdexServerWeb, :controller

  alias LambdexServer.Lambdas
  alias LambdexServer.Lambdas.Lambda

  action_fallback LambdexServerWeb.FallbackController

  def index(conn, _params) do
    lambdas = Lambdas.list_lambdas(conn.assigns.current_user.id)
    render(conn, "index.json", lambdas: lambdas)
  end

  def create(conn, %{"lambda" => lambda_params}) do
    lambda = Map.put(lambda_params, "user_id", conn.assigns.current_user.id)
    with {:ok, %Lambda{} = lambda} <- Lambdas.create_lambda(lambda) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.lambda_path(conn, :show, lambda))
      |> render("show.json", lambda: lambda)
    end
  end

  def show(conn, %{"id" => id}) do
    lambda = Lambdas.get_lambda!(conn.assigns.current_user.id, id)
    render(conn, "show.json", lambda: lambda)
  end

  def update(conn, %{"id" => id, "lambda" => lambda_params}) do
    lambda = Lambdas.get_lambda!(conn.assigns.current_user.id, id)

    with {:ok, %Lambda{} = lambda} <- Lambdas.update_lambda(lambda, lambda_params) do
      render(conn, "show.json", lambda: lambda)
    end
  end

  def delete(conn, %{"id" => id}) do
    lambda = Lambdas.get_lambda!(conn.assigns.current_user.id, id)

    with {:ok, %Lambda{}} <- Lambdas.delete_lambda(lambda) do
      send_resp(conn, :no_content, "")
    end
  end
end
