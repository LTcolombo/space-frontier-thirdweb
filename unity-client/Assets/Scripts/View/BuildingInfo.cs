using System;
using System.Collections;
using System.Collections.Generic;
using CityBuilding;
using UnityEngine;
using UnityEngine.UI;

public class BuildingInfo : MonoBehaviour
{
    [SerializeField] private Text level;
    [SerializeField] private Text state;
    [SerializeField] private Text yield;
    [SerializeField] private Image bg;
    [SerializeField] private Image fill;
    [SerializeField] private Text statePercentage;

    public void SetData(BuildingData value)
    {
        if (value == null)
            return;
        
        level.text = "Level: " + value.level;
        state.text = "State: " + value.state;
        var valueLevel = value.level * (int)value.state;
        yield.text = $"Yield: {valueLevel}/day";
        float maxLevel = 20;
        var percentage = valueLevel / maxLevel;

        yield.text = $"Yield: {valueLevel}/day";
        fill.fillAmount = percentage;
        statePercentage.text = $"{percentage:0%}";

        var r = (byte)(byte.MaxValue * Math.Clamp((1 - percentage) * 2f, 0, 1f));
        var g = (byte)(byte.MaxValue * Math.Clamp(percentage * 2, 0f, 1f));
        bg.color = new Color32(r, g, 0, 40);
        fill.color = new Color32(r, g, 0, byte.MaxValue);
    }
}
