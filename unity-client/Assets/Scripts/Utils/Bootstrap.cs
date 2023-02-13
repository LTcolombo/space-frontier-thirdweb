using System.Runtime.InteropServices;
using Avatar;
using DefaultNamespace;
using Thirdweb;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Utils.Injection;

public class Bootstrap : InjectableBehaviour
{
    [SerializeField] private Text label;

    [Inject] private AccountModel _account;
    [Inject] private DataController _data;

    private readonly ThirdwebSDK _sdk = new("mumbai");

    private async void Start()
    {
        var address = DefaultAddress;
#if UNITY_WEBGL && !UNITY_EDITOR
        address = await _sdk.wallet.Connect(new WalletConnection
        {
            provider = WalletProvider.MetaMask,
            chainId = 80001
        });
#endif
        HandleWalletId(address);
    }

    private const string DefaultAddress = "0xEd83718F9F947d976f63174Eb6512615b5a5975b";


    private async void HandleWalletId(string value)
    {
        _account.Id = value;
        label.text = "Authenticated as " + value;

        await _data.Refresh();

        SceneManager.LoadScene("MainArea");
    }
}