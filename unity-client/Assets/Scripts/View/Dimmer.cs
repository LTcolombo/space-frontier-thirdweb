using System.Collections;
using UnityEngine;
using Image = UnityEngine.UI.Image;

namespace View
{
    [RequireComponent(typeof(Image))]
    public class Dimmer : MonoBehaviour
    {
        private Image _img;

        // Start is called before the first frame update
        void Start()
        {
            _img = GetComponent<Image>();
            StartCoroutine(nameof(FadeIn));
        }

        private IEnumerator FadeIn()
        {
            while (_img.color.a > 0)
            {
                _img.color -= new Color(0, 0, 0, 0.01f);   
                yield return null;
            }
        }

        // Update is called once per frame
        public void Dim()
        {
            _img.color = Color.black;
            
            StartCoroutine(nameof(FadeIn));
        }
    }
}
