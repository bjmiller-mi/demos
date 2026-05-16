FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /src
COPY ["LaborMgmt.Api/LaborMgmt.Api.csproj", "LaborMgmt.Api/"]
RUN dotnet restore "LaborMgmt.Api/LaborMgmt.Api.csproj"
COPY . .
WORKDIR /src/LaborMgmt.Api
EXPOSE 80
ENTRYPOINT ["dotnet", "watch", "run", "--no-launch-profile"]
