using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Services
{

    public class ReversiAPIClient {
        private readonly HttpClient httpClient;
        private const string BaseUrl = "https://localhost:5001/api/game";

        public ReversiAPIClient() {
            httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(BaseUrl);
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<List<Game>> GetGamesAwaitingPlayers() {
            //No string needed since the base address is set
            var response = await httpClient.GetAsync(string.Empty);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Game>>(content);
        }

        public async Task<bool> CreateGame(Game game)
        {
            //Only needs descriptions and player1Token
            var gameDTO = new {
                Description = game.Description,
                Player1Token = game.Player1Token
            };
            var json = JsonConvert.SerializeObject(gameDTO);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var post = await httpClient.PostAsync("", content);
            post.EnsureSuccessStatusCode();

            return true;
        }

        public async Task<Game> GetGame(string token) {
            var response =  await httpClient.GetAsync(BaseUrl + "/" + token);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<Game>(content);
        }

        public async Task<List<Game>> GetPlayerGames(string playerToken) {
            var response =  await httpClient.GetAsync(BaseUrl + "/" + playerToken + "/anygames");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Game>>(content);
        }

        public async Task<ApiGameStatus> GetGameStatus(string token) {
            var response =  await httpClient.GetAsync(BaseUrl + "/" + token + "/status");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<ApiGameStatus>(content);
        }

        public async Task<bool> RemoveGame(string token, string playerToken) {
            var removeGame = new ApiPlayerGameData() {
                GameToken = token,
                PlayerToken = playerToken
            };
            var json = JsonConvert.SerializeObject(removeGame);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            //DeleteASync doesn't have support to add json frombody, so I had to create a custom request
            var request = new HttpRequestMessage() {
                Method = HttpMethod.Delete,
                RequestUri = new Uri(BaseUrl + "/" + playerToken),
                Content = content
            };
            var response = await httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            throw response.StatusCode switch {
                HttpStatusCode.Unauthorized => new UnauthorizedAccessException(
                    "You are not the host of the game, you can't delete."),
                HttpStatusCode.NotFound => new KeyNotFoundException("Game not found."),
                _ => new Exception($"Something went wrong while removing this game: {response.StatusCode}")
            };
        }

        public async Task<bool> UpdatedScores(string token, string playerToken)
        {
            var json = JsonConvert.SerializeObject(playerToken);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PutAsync(BaseUrl + $"/result/{token}", content);
            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            throw response.StatusCode switch {
                HttpStatusCode.Unauthorized => new UnauthorizedAccessException("Invalid player token"),
                HttpStatusCode.NotFound => new KeyNotFoundException("Game not found."),
                _ => new Exception($"Something went wrong while updating scores: {response.StatusCode}")
            };
        }
    }
}
